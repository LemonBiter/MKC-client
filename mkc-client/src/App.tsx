import {
  Admin,
  Resource,
  ListGuesser,
  EditGuesser,
  ShowGuesser,
} from "react-admin";
import PostIcon from "@mui/icons-material/Book";
import UserIcon from "@mui/icons-material/Group";
import { dataProvider } from "./dataProvider";
import { authProvider } from "./authProvider";
import { UserList } from "./user"
import {PostCreate, PostEdit, PostList} from "./posts"
import {Dashboard} from "./dashboard";

export const App = () => (
  <Admin authProvider={authProvider}
         dataProvider={dataProvider}
         dashboard={Dashboard}>
    <Resource name="posts"
              list={PostList}
              create={PostCreate}
              edit={PostEdit}
              icon={PostIcon} />
    <Resource name="users"
              list={UserList}
              show={ShowGuesser}
              recordRepresentation="name"
              icon={UserIcon} />
  </Admin>
);
