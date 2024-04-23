import {
    List,
    Datagrid,
    TextField,
    ReferenceField,
    EditButton,
    SimpleForm,
    Edit,
    ReferenceInput,
    TextInput, Create
} from "react-admin";
import { useRecordContext } from "react-admin";

const PostTitle = () => {
    const record = useRecordContext();
    return <span>Post {record ? `"${record.title}"` : ''}</span>;
}

const postFilters = [
    <TextInput label="Search" source="q" alwaysOn />,
    <ReferenceInput label="User" source="userId" reference="users" />
]

const data = [
    { id: 1, userId: 1, title: 'First Post', body: 'Content of the first post' },
    { id: 2, userId: 2, title: 'Second Post', body: 'Content of the second post' }
];

export const PostList = (props) => {
    return (
    <List
        data={data}
        filters={postFilters}>
        <Datagrid
            rowClick="edit">
            <ReferenceField source="userId" reference="users" link="show" />
            <TextField source="title" />
            <EditButton />
        </Datagrid>
    </List>
)}

export const PostEdit = () => (
    <Edit title={<PostTitle />}>
        <SimpleForm>
            <TextInput source="id" InputProps={{ disabled: true }} />
            <ReferenceInput source="userId" reference="users" />
            <TextInput source="title" />
            <TextInput source="body" multiline rows={5} />
        </SimpleForm>
    </Edit>
);

export const PostCreate = () => (
      <Create>
            <SimpleForm>
              <ReferenceInput source="userId" reference="users" />
              <TextInput source="title" />
              <TextInput source="body" multiline rows={5} />
            </SimpleForm>
          </Create>
    );

