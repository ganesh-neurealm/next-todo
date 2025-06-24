'use client';

import { addTodo } from '@/app/actions/todo';
import { Input, Button, Typography, Space, Row, Col, message } from 'antd';
import { useRouter } from 'next/navigation';
import { useActionState, useEffect } from 'react';
import { useFormStatus } from 'react-dom';

export default function CreateTodoForm() {
  const router = useRouter();
  const [state, action] = useActionState(addTodo, { message: '' });

  useEffect(() => {
    if (state.message === 'Created') {
      message.success('Todo created successfully');
      const timeout = setTimeout(() => {
        router.push('/todo');
      }, 800);
      return () => clearTimeout(timeout);
    } else if (state.message && state.message !== 'Created') {
      message.error(state.message || 'Something went wrong');
    }
  }, [state.message, router]);

  return (
      <>
        <Row justify="start" style={{ padding: '16px 24px' }}>
          <Col>
            <Button type="link" onClick={() => router.back()}>
              ← Back
            </Button>
          </Col>
        </Row>
    
        <Row justify="center" align="middle" style={{ minHeight: '80vh' }}>
          <Col xs={22} sm={16} md={12} lg={8}>
            <form action={action} noValidate>
              <Space direction="vertical" size="large" style={{ width: '100%' }}>
                <Typography.Title level={3} style={{ textAlign: 'center' }}>
                  Add a New Todo
                </Typography.Title>
    
                <Typography.Text strong>Todo Title</Typography.Text>
                <Input name="title" placeholder="Enter todo" required />
    
                <SubmitButton />
    
                <Typography.Text type="secondary" style={{ textAlign: 'center' }}>
                  Please enter a descriptive title for your todo item.
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
      {status.pending ? 'Creating Todo...' : 'Create Todo'}
    </Button>
  );
}
