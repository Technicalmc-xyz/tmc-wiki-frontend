import React from 'react';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import Home from './components/Home/Home';
import Posts from './components/Posts/Posts';
import RenderedPost from "./components/RenderedPost/RenderedPost";
import EditPost from "./components/EditPost/EditPost";
import NewPost from "./components/NewPost/NewPost";
import Archive from "./components/Archive/Archive";
import About from "./components/About/About";
import License from './components/License/License';
import Permissions from "./components/Administrative/Permissions";
import NotFound from "./components/ErrorPages/NotFound";
import Profile from "./components/User/Profile";
import Layout from "./components/layout";
const App = () => {
    return (
        <Router>
            <div>
                <Layout>
                    <Switch>
                        <Route exact path='/' component={Home}/>
                        <Route path='/perms' component={Permissions}/>
                        <Route path='/profile' component={Profile}/>
                        <Route exact path='/about' component={About}/>
                        <Route path='/posts' component={Posts}/>
                        <Route path='/render-post/:id' component={RenderedPost}/>
                        <Route path='/new-post' component={NewPost}/>
                        <Route path='/edit-post/:id' component={EditPost}/>
                        <Route path='/archive' component={Archive}/>
                        <Route path='/license' component={License}/>
                        <Route component={NotFound}/>
                    </Switch>
                </Layout>
            </div>
        </Router>
    );
}
export default App;
