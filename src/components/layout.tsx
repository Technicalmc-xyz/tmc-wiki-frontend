import React from "react"
import Nav from "./nav";
import Footer from "./footer";
import PropTypes from "prop-types"
import {Box} from "@chakra-ui/react";

const Layout = ({children}) => {
    return (
        <div style={{"minHeight": "100vh"}}>
            <Nav/>
            <Box
                style={{
                    margin: `5vw auto 0 auto`,
                    maxWidth: 1200,
                    padding: `0 1.0875rem 10rem`,
                }}
            >
                <main
                    style={{marginBottom: "7vh"}}>
                    {children}
                </main>

            </Box>
            <Footer/>
        </div>
    )
}

Layout.propTypes = {
    children: PropTypes.node.isRequired,
}

export default Layout

