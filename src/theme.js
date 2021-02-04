// theme.js

// 1. import `extendTheme` function
import {extendTheme} from "@chakra-ui/react"
import {mode} from '@chakra-ui/theme-tools';
// 2. Add your color mode config
const config = {
    initialColorMode: "light",
    useSystemColorMode: false,
}
const styles = {
    global: props => ({
        body: {
            color: mode('gray.900', 'whiteAlpha.900')(props),
        },
        nav: {
            bg: mode('#ECEFF1', '#222222')(props),
            borderWidth: mode('px', "none")(props),
            shadow: "md"
        },
        footer: {
            bg: mode('#ECEFF1', '#222222')(props),
            borderWidth: mode('px', "none")(props),
            shadow: "md"
        },
        a: {
            color: mode('gray.900', 'whiteAlpha.900')(props),
        },
        svg: {
            color: mode('gray.900', 'whiteAlpha.900')(props),
        }
    }),
};
const components = {
    Drawer: {
        // setup light/dark mode component defaults
        baseStyle: props => ({
            dialog: {
            },
        }),
    },
    Button: {
        // 1. We can update the base styles
        baseStyle: {
            fontWeight: "bold", // Normally, it is "semibold"
        },
        // 2. We can add a new button size or extend existing
        sizes: {
            xl: {
                h: "56px",
                fontSize: "lg",
                px: "32px",
            },
        },
        // 3. We can add a new visual variant
        variants: {
            "with-shadow": {
                bg: "red.400",
                boxShadow: "0 0 2px 2px #efdfde",
            },
            // 4. We can override existing variants
            solid: (props) => ({
                bg: mode("blue.600", "#ff6768")(props),
                color: mode("whiteAlpha.900", "whiteAlpha.900")(props)
            }),
            outline: (props) => ({
                color: mode("gray.900", "whiteAlpha.900")(props),
                borderColor: mode("gray.900", "whiteAlpha.900")(props)
            }),
        },
    },
}
// 3. extend the theme
const theme = extendTheme({
    config,
    styles,
    components
});

export default theme