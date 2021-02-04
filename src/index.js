import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter} from 'react-router-dom';
import {ChakraProvider, ColorModeScript} from "@chakra-ui/react";
import theme from "./theme"
import * as serviceWorker from './serviceWorker';
import App from "./App";

ReactDOM.render(
    <React.StrictMode>
        <ChakraProvider theme={theme}>
            <BrowserRouter>
                <ColorModeScript initialColorMode={theme.config.initialColorMode}/>
                    <App/>
            </BrowserRouter>
        </ChakraProvider>
    </React.StrictMode>,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();


