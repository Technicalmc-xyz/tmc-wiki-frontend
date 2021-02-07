import React from "react"
import Permissions from "./Permissions";
import ArticleAdmin from "./ArticleAdmin";
import { TabList, Tab, Tabs, TabPanels, TabPanel } from "@chakra-ui/react";


const Admin = () =>
    <Tabs>
        <TabList>
            <Tab>Articles</Tab>
            <Tab>Permissons</Tab>
        </TabList>
        <TabPanels>
            <TabPanel>
                <ArticleAdmin/>
            </TabPanel>
            <TabPanel>
                <Permissions/>
            </TabPanel>
        </TabPanels>
    </Tabs>


export default Admin;
