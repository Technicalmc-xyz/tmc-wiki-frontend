import React from "react"
import Permissions from "./Permissions";
import ArticleAdmin from "./ArticleAdmin";
import Holding from "./Holding";


const Admin = () =>
    <div>
        <ul className="nav nav-pills" id="myTab" role="tablist">
            <li className="nav-item" role="presentation">
                <a className="nav-link" id="permissions" data-bs-toggle="tab" href="#perms" role="tab"
                   aria-controls="home" aria-selected="false">Permissions</a>
            </li>
            <li className="nav-item" role="presentation">
                <a className="nav-link active" id="articles" data-bs-toggle="tab" href="#art" role="tab"
                   aria-controls="profile" aria-selected="true">Articles</a>
            </li>
        </ul>
        <div className="tab-content" id="myTabContent">
            <div className="tab-pane fade " id="perms" role="tabpanel" aria-labelledby="permissions"><Permissions/></div>
            <div className="tab-pane fade show active" id="art" role="tabpanel" aria-labelledby="articles"><ArticleAdmin/></div>
        </div>
    </div>


export default Admin;
