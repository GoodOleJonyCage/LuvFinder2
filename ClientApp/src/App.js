import React, { Component } from 'react';
import { Route, Routes } from 'react-router-dom';
import AppRoutes from './AppRoutes';
import { Layout } from './components/Layout';
//import { HomePage } from "./Pages/HomePage";
import { EditProfilePage } from "./Pages/EditProfilePage"
import { ChatSummary } from './components/ChatSummary'
import { ChatMessages } from "./components/ChatMessages"
import { EditBlog } from "./components/EditBlog"
import { CreateBlog } from "./components/CreateBlog"

export default class App extends Component {
  static displayName = App.name;

  render() {
    return (
      <Layout>
        <Routes>
            {
            AppRoutes.map((route, index) => {
            const { element, ...rest } = route;
                return <>
                    {
                        element.type.name === "EditProfilePage" ?
                        <Route key={index} path="/editprofile" element={<EditProfilePage />}>
                                <Route path="chatsummary" element={<ChatSummary />} />
                                <Route path="chatmessages" element={<ChatMessages />} />
                                <Route path="editblog" element={<EditBlog />} />
                                <Route path="createblog" element={<CreateBlog />} />
                        </Route> :
                        <Route key={index} {...rest} element={element} />}
                       </>
                    }
            )}
        </Routes>
      </Layout>
    );
  }
}
