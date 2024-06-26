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
    TextField, EditButton, Title,
} from "react-admin";
import { Route } from 'react-router';
import { BrowserRouter } from 'react-router-dom'
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
import OrderEdit from "./components/orders/OrderEdit"
import MessageShow from "./components/message/messageShow";
import {useSelector} from "react-redux";
import StorageShow from "./components/storage/storageShow";
import MessageList from "./components/message/messageList";
import EmployeeList from "./components/employee/employeeList";
import CalendarShow from "./components/calendar/calendarShow";
import EmployeeCreate from "./components/employee/employeeCreate";


export const App = () => {
    return (
          <Admin
                dataProvider={dataProvider}
                 layout={layout}
                  loginPage={LoginPage}
                  i18nProvider={i18nProvider}
                  authProvider={authProvider}
                  dashboard={Dashboard}>
              <Title title="Modern Kitchens Cabinets Admin"/>
              <CustomRoutes>
                  <Route path="/calendar" element={<CalendarShow />} />
              </CustomRoutes>
              {/*<CustomRoutes>*/}
              {/*    <Route path="/message" element={<MessageShow />} />*/}
              {/*</CustomRoutes>*/}
              <CustomRoutes>
                  <Route path="/storage" element={<StorageShow />} />
              </CustomRoutes>
              <Resource
                  name="message"
                  list={MessageList}
                   />
              <Resource
                  name="order"
                  {...orders} />
              <Resource
                  {...material}
                  list={<MaterialList  />}
                  options={{label: 'Material'}}
                  name="material" />
              <Resource
                  {...accessory}
                  options={{label: 'Accessory'}}
                  name="accessory" />
              <Resource
                  list={<EmployeeList />}
                  create={<EmployeeCreate />}
                  options={{label: 'Material'}}
                  name="employee" />
          </Admin>
)};

