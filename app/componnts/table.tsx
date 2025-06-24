'use client';

import { MaterialReactTable } from 'material-react-table';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import {
  Button,
  Space,
  notification,
} from 'antd';
import { useRouter } from 'next/navigation';
import { getTodos, deleteTodo } from '@/app/actions/todo';
import { useEffect } from 'react';
import { useTodoStore } from '@/app/store/todo';
import styles from './table.module.css';

export const MaterialTable = () => {
  const router = useRouter();
  const { todos, setTodos } = useTodoStore();
  const [api, contextHolder] = notification.useNotification();

  useEffect(() => {
    getTodos().then(setTodos);
  }, [setTodos]);

  const handleDelete = async (id: string | number) => {
    try {
      const res = await deleteTodo(id);

      if (res.message === 'Deleted') {
        const updatedTodos = await getTodos();
        setTodos(updatedTodos);
        api.success({ message: 'Todo deleted successfully' });
      } else {
        api.error({ message: res.message || 'Failed to delete todo' });
      }
    } catch (error) {
      console.log('error:', error);
      api.error({ message: 'Failed to delete todo' });
    }
  };

  return (
    <div>
      {contextHolder}
      <div className={styles.actionsBar}>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => router.push('/todo/create')}
        >
          Add Todo
        </Button>
      </div>

      <MaterialReactTable
        columns={[{ header: 'Title', accessorKey: 'title' }]}
        data={todos}
        enableRowActions
        positionActionsColumn="last"
        renderRowActions={({ row }) => (
          <Space>
            <Button
              icon={<EditOutlined />}
              onClick={() => router.push(`/todo/update/${row.original.id}`)}
            />
            <Button
              danger
              icon={<DeleteOutlined />}
              onClick={() => handleDelete(row.original.id)}
            />
          </Space>
        )}
      />
    </div>
  );
};
