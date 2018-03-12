# example makefile for granular builds,
# just need to integrate it now into `build`
# see https://stackoverflow.com/questions/1139271/makefiles-with-source-files-in-different-directories

.PHONY: all clean

babel := ../../node_modules/.bin/babel
src_files := $(shell find src/ -name '*.js')
transpiled_files := $(patsubst src/%,lib/%,$(src_files))

all: $(transpiled_files)

lib/%: src/%
	mkdir -p $(dir $@)
	$(babel) $< --out-file $@ --source-maps
