import React from "react"
import Permissions from "./Permissions";
import ArticleAdmin from "./ArticleAdmin";
import { TabList, Tab, Tabs, TabPanels, TabPanel } from "@chakra-ui/react";


const Admin = () =>
    <Tabs>
        <TabList>
            <Tab>Permissons</Tab>
            <Tab>Articles</Tab>
        </TabList>
        <TabPanels>
            <TabPanel>
                <Permissions/>
            </TabPanel>
            <TabPanel>
                <ArticleAdmin/>
            </TabPanel>
        </TabPanels>
    </Tabs>


export default Admin;
