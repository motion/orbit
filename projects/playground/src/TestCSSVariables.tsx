import { Button, Stack, Theme, View } from '@o/ui'
import { useState } from 'react'
import React from 'react'

/**
 * Steps for css variable support in themes
 *
 * Step 1 (Themes can generate variables):
 *
 *   1. add createTheme() => Theme
 *   2. we need a root manager for theme variable insertion
 *      2.1. ThemeProvide:
 *        - Should map over themes and collect their variable-able items
 *        - themeToVariables() => a css sheet with variables defined
 *   3. @o/color needs a canBeCSSVariable = true or similar
 *   4. Get it so it inserts sheet properly
 *
 * Step 2 (Gloss, @o/css uses those variables):
 *
 *   1. Gloss can detect variables and output them
 *   2. Test it works and determine if this should be in css or gloss
 *      (that depends on where we best optimize tracking/changes)
 *   3. On change theme we need to update the CSS variables
 *
 * Step 3 (Don't update if only variables are used via useTheme)
 *
 *   1. useTheme or createTheme need to make a proxy to track usage
 *   2. Needs a "didUseOnlyVariables" getter
 *   3. On theme change if "didUseOnlyVariables" = true then no need to update
 *
 * Step 4 (How do we know they only used the variable not the value?)
 *
 *   1. Probably we need something like .getCSSVariable()
 *   2. Gloss themeFn/css will use that by default
 *   3. But if you are a normal view and you useTheme() you'd need to call that explicitly (?)
 *
 */

export function TestCSSVariables() {
  const [theme, setTheme] = useState('light')
  return (
    <Theme name={theme}>
      <View padding="lg" flex={1} background={theme => theme.background}>
        <Stack space="lg">
          <Button size={2} onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
            Change theme
          </Button>
          <Button coat="lightBlue">lightBlue</Button>
          <Button coat="flat">flat</Button>
          <Button coat="bordered">bordered</Button>
        </Stack>
      </View>
    </Theme>
  )
}
