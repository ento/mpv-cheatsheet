TARGET := dist/cheatsheet.js
COMPILER := browserify

$(TARGET): $(wildcard src/*.js)
	mkdir -p $(@D)
	$(COMPILER) --bare src/index.js > $@

.PHONY: install
install: $(TARGET)
	mkdir p ~/.config/mpv/scripts/
	cp $< ~/.config/mpv/scripts/
