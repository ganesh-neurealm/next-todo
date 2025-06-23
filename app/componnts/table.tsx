"use client";
import { MaterialReactTable } from "material-react-table";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { Alert, Button, message as antdMessage, Space } from "antd";
import { useRouter } from "next/navigation";
import { getTodos, deleteTodo } from "@/app/actions/todo";
import { useEffect, useState } from "react";
import { useTodoStore } from "@/app/store/todo";
import { PlusOutlined } from "@ant-design/icons";
import styles from './table.module.css';

export const MaterialTable = () => {
  const router = useRouter();
  const { todos, setTodos } = useTodoStore();
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    getTodos().then(setTodos);
  }, [setTodos]);

  const handleDelete = async (id: string | number) => {
    try {
      const res = await deleteTodo(id);
  
      if (res.message === 'Deleted') {
        const updatedTodos = await getTodos();
        setTodos(updatedTodos);
  
        setSuccessMessage('Todo deleted successfully');
        setTimeout(() => {
          setSuccessMessage('');
        }, 1000);
      } else {
        antdMessage.error(res.message || 'Failed to delete todo');
      }
    } catch (error) {
      console.log("error:", error)
      antdMessage.error('Failed to delete todo');
    }
  };

  return (
    <div>
      <div className={styles.actionsBar}>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => router.push("/todo/create")}>
          Add Todo
        </Button>
      </div>
      {successMessage && (
        <Alert
          message={successMessage}
          type="success"
          showIcon
          style={{ marginBottom: 16 }}
        />
      )}
      <MaterialReactTable
        columns={[{ header: "Title", accessorKey: "title" }]}
        data={todos}
        enableRowActions={true}
        positionActionsColumn="last"
        renderRowActions={({ row }) => (
          <Space>
            <Button icon={<EditOutlined />} onClick={() => router.push(`/todo/update/${row.original.id}`)} />
            <Button danger icon={<DeleteOutlined />} onClick={() => handleDelete(row.original.id)} />
          </Space>
        )}
      />
    </div>
  );
};
