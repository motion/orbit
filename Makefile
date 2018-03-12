TRANSPILER := ./node_modules/.bin/babel
TRANSPILER_OPTS =

# Directories
PKGS_ROOT := packages
PKGS_SRCDIR := src
PKGS_OUTDIR := lib

# Expands to the source directory for the specified package
pkg-srcdir = $(PKGS_ROOT)/$1/$(PKGS_SRCDIR)
# Expands to the output directory for the specified package
pkg-libdir = $(PKGS_ROOT)/$1/$(PKGS_OUTDIR)
# Expands to all output targets for the specified package
pkg-libs-js = $(addprefix $(call pkg-libdir,$1)/,$(patsubst %.jsx,%.js,$(notdir $(wildcard $(call pkg-srcdir,$1)/*.js*))))

# Defines the following rules for the specified package:
define pkg-rules

# build rule for .js(x) files
$(call pkg-libdir,$1)/%.js: $(call pkg-srcdir,$1)/%.js* | $(call pkg-libdir,$1)
	$(TRANSPILER) $(TRANSPILER_OPTS) --out-file $$@ $$^

# rule to create the output directory if missing
$(call pkg-libdir,$1):
	@mkdir $$@

# package rule to build all outputs
$1: $(call pkg-libs-js,$1) $(call pkg-libs-css,$1)

# clean-package rule to remove the output directory
clean-$1:
	rm -rf $(call pkg-libdir,$1) $(call pkg-srcdir,$1)/../node_modules

clean-packages: clean-$1
packages: $1

.PHONY: $1 clean-$1 clean-packages check-packages
endef

# Creates rules for the specified package
add-pkg = $(eval $(call pkg-rules,$1))

# Create rules for all packages
PKGS := $(notdir $(wildcard $(PKGS_ROOT)/*))
$(foreach p,$(PKGS),$(call add-pkg,$p))

clean: clean-packages
all: packages

# Will be filled in by pkg-rules
.PHONY: all
.DEFAULT_GOAL := all
