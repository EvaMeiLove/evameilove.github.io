"""Проверка первоначального HTML без JavaScript и доступа к YouTube."""
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit, unquote

ROOT = Path("out")


class Check(HTMLParser):
    def __init__(self):
        super().__init__()
        self.stack = []
        self.errors = []
        self.headings = 0

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        hidden = "opacity:0;" in (attrs.get("style", "") + ";") or attrs.get("style", "").endswith("opacity:0")
        parent_hidden = any(self.stack)
        if tag in ("h1", "h2"):
            self.headings += 1
            if hidden or parent_hidden:
                self.errors.append("Заголовок скрыт в первоначальном HTML")
        if tag == "iframe":
            self.errors.append("Плеер загружается до нажатия")
        for attr in ("src", "srcset"):
            value = attrs.get(attr, "")
            if "youtube" in value or "ytimg" in value or "mc.yandex" in value:
                self.errors.append("Внешний ресурс загружается до нажатия: " + value)
        if tag in ("img", "script", "link"):
            value = attrs.get("src", "") if tag != "link" else attrs.get("href", "")
            if value.startswith("/") and not value.startswith("//"):
                if not (ROOT / unquote(urlsplit(value).path).lstrip("/")).exists():
                    self.errors.append("Отсутствует локальный ресурс: " + value)
        if tag not in ("area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "param", "source", "track", "wbr"):
            self.stack.append(hidden)

    def handle_endtag(self, tag):
        if self.stack:
            self.stack.pop()


check = Check()
check.feed((ROOT / "index.html").read_text())
assert check.headings >= 5, "Потеряны основные разделы"
assert not check.errors, "\n".join(check.errors)
print("OK: разделы видимы без JS, внешние медиа не загружаются, локальные ресурсы существуют")
