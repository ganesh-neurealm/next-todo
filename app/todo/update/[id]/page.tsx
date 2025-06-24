'use client';

import { useParams, useRouter } from 'next/navigation';
import { useActionState, useEffect } from 'react';
import { updateTodo } from '@/app/actions/todo';
import { useTodoStore } from '@/app/store/todo';
import type { Todo } from '@/app/types/todo';
import {
  Row,
  Col,
  Space,
  Typography,
  Input,
  Button,
  message,
} from 'antd';
import { useFormStatus } from 'react-dom';

export default function UpdateTodo() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const { todos } = useTodoStore();
  const [state, formAction] = useActionState(updateTodo, { message: '' });
  const todo: Todo | undefined = todos.find((t) => t.id === id);

  useEffect(() => {
    if (state.message === 'Updated') {
      message.success('Todo updated successfully');
      const timeout = setTimeout(() => {
        router.push('/todo');
      }, 800);
      return () => clearTimeout(timeout);
    } else if (state.message && state.message !== 'Updated') {
      message.error(state.message || 'Failed to update');
    }
  }, [state.message, router]);

  if (!todo) return <Typography.Text>Todo not found</Typography.Text>;

  return (
    <>
      <Row justify={"start"} style={{ padding: '16px 24px' }}>
        <Col>
          <Button type="link" onClick={() => router.back()}>
            ← Back
          </Button>
        </Col>
      </Row>

      <Row justify="center" align="middle" style={{ minHeight: '80vh' }}>
        <Col xs={22} sm={16} md={12} lg={8}>
          <form action={formAction} noValidate>
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              <Typography.Title level={3} style={{ textAlign: 'center' }}>
                Update Todo
              </Typography.Title>

              <input type="hidden" name="id" value={todo.id} />

              <Typography.Text strong>Todo Title</Typography.Text>
              <Input
                name="title"
                defaultValue={todo.title}
                placeholder="Enter updated title"
                required
              />

              <SubmitButton />

              <Typography.Text type="secondary" style={{ textAlign: 'center' }}>
                Update the title and click the button to save changes.
              </Typography.Text>
            </Space>
          </form>
        </Col>
      </Row>
    </>
  );
}

function SubmitButton() {
  const status = useFormStatus();
  return (
    <Button
      type="primary"
      htmlType="submit"
      block
      loading={status.pending}
    >
      {status.pending ? 'Updating...' : 'Update Todo'}
    </Button>
  );
}
