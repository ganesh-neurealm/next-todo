'use client';

import { addTodo } from '@/app/actions/todo';
import { Input, Button, Typography, Space, Alert, Row, Col } from 'antd';
import { useRouter } from 'next/navigation';
import { useActionState, useEffect } from 'react';
import { useFormStatus } from 'react-dom';

export default function CreateTodoForm() {
    const router = useRouter();
  const [state, action] = useActionState(addTodo, { message: '' });
  useEffect(() => {
    if (state.message === 'Created') {
      const timeout = setTimeout(() => {
        router.push('/todo');
      }, 500);
  
      return () => clearTimeout(timeout);
    }
  }, [state.message, router]);
  return (
    <Row justify="center" align="middle" style={{ minHeight: '80vh' }}>
      <Col xs={22} sm={16} md={12} lg={8}>
        <form action={action} noValidate>
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <Typography.Title level={3} style={{ textAlign: 'center' }}>
              Add a New Todo
            </Typography.Title>

            {state.message && (
              <Alert
                message={state.message}
                type={state.message === 'Created' ? 'success' : 'error'}
                showIcon
              />
            )}

            <Typography.Text strong>Todo Title</Typography.Text>
            <Input
              name="title"
              placeholder="Enter todo"
              required
            />
            <SubmitButton/>
            <Typography.Text type="secondary" style={{ textAlign: 'center' }}>
              Please enter a descriptive title for your todo item.
            </Typography.Text>
          </Space>
        </form>
      </Col>
    </Row>
  );
}

function SubmitButton () {
    const status = useFormStatus();
    return  (
        <Button
              type="primary"
              htmlType="submit"
              block
            >
              {!status.pending ? 'Create Todo' : 'Create Todo ...'}
            </Button>
    )
}

