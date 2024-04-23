import {
    Admin,
    Resource,
    ListGuesser,
    EditGuesser,
    ShowGuesser,
    CustomRoutes,
    Create,
    SimpleForm,
    TextInput,
    required,
    DateInput,
    List,
    Datagrid,
    ReferenceField,
    TextField, EditButton,
} from "react-admin";
import { Route } from 'react-router';
import polyglotI18nProvider from 'ra-i18n-polyglot';
import PostIcon from "@mui/icons-material/Book";
import UserIcon from "@mui/icons-material/Group";
import { authProvider } from "./authProvider";
import { UserList } from "./user"
import {PostCreate, PostEdit, PostList} from "./posts"
import {Dashboard} from "./dashboard";
import LoginPage from "./components/loginPage";
import Layout from './components/layout/Layout'
import Segments from "./segments/Segments";
import i18nProvider from './i18n/index'
import OrderCreate from "./components/orders/OrderCreate";
import * as React from "react";
import layout from "./components/layout/Layout";
// import {dataProvider} from './data-provider/data-provider'
import {dataProvider} from "./dataProvider";
import orders from "./components/orders";
import material from "./components/material";
import MaterialList from "./components/material/materialList";
import accessory from "./components/accessory";



export const App = () => {
    return (
  <Admin
      dataProvider={dataProvider}
        layout={layout}
         loginPage={LoginPage}
         i18nProvider={i18nProvider}
         authProvider={authProvider}
         dashboard={Dashboard}>
      <Resource
      name="order"
      {...orders}
      options={{ label: 'Orders' }}
      />
      <Resource
          {...material}
          options={{label: 'Material'}}
          name="material" />
      <Resource
          {...accessory}
          options={{label: 'Accessory'}}
          name="accessory" />
  </Admin>
)};

