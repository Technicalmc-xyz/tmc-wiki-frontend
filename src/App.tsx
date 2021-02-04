import React, {useLayoutEffect} from 'react';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import Home from './components/Home/Home';
import Posts from './components/Articles/Articles';
import RenderedArticle from "./components/RenderedArticle/RenderedArticle";
import EditArticle from "./components/EditArticle/EditArticle";
import NewArticle from "./components/NewArticle/NewArticle";
import Archive from "./components/Archive/Archive";
import About from "./components/About/About";
import License from './components/License/License';
import Permissions from "./components/Administrative/Permissions";
import NotFound from "./components/NotFound";
import Profile from "./components/User/Profile";
import Layout from "./components/layout";
import Admin from "./components/Administrative/Admin";

const App = (): JSX.Element => {
    useLayoutEffect(() => {
        //TODO: setTimeout with 0 made it work in Safari - i dont know why
        setTimeout(() => {
            const { hash } = window.location
            if (!hash) return
            else if (hash) {
                const id = hash.replace('#', '')
                const element = document.getElementById(id)
                if (element) {
                    element.scrollIntoView({behavior: "smooth", inline: "nearest"});
                }
            }
        }, 100)
    }, [])

    return (
        <Router>
            <Layout>
                <Switch>
                    {/*Home*/}
                    <Route exact path='/' component={Home}/>

                    {/*Users*/}
                    <Route path='/profile' component={Profile}/>
                    <Route path='/perms' component={Permissions}/>

                    {/*articles*/}
                    <Route path='/articles' component={Posts}/>
                    <Route path='/render-article/:id' component={RenderedArticle}/>
                    <Route path='/new-article' component={NewArticle}/>
                    <Route path='/edit-article/:id' component={EditArticle}/>
                    <Route path='/archive' component={Archive}/>
                    <Route path='category/:tag'/>
                    <Route path='/admin' component={Admin}/>

                    {/*misc*/}
                    <Route path='/license' component={License}/>
                    <Route exact path='/about' component={About}/>

                    {/*404*/}
                    <Route component={NotFound}/>
                </Switch>
            </Layout>
        </Router>
    );
}
export default App;
