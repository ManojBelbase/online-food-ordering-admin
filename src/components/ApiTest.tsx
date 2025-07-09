import React, { useState } from 'react';
import { Button, Stack, Text, Code, Paper } from '@mantine/core';
import axios from 'axios';

const ApiTest: React.FC = () => {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testApiEndpoint = async () => {
    setLoading(true);
    try {
      // Test using Vite environment variable
      const apiUrl = import.meta.env.VITE_API_URL;
      console.log('🌐 Using API URL:', apiUrl);

      const response = await axios.post(
        `${apiUrl}auth/login`,
        {
          email: 'test@example.com',
          password: 'password123'
        },
        {
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );
      
      setResult({
        success: true,
        status: response.status,
        data: response.data
      });
    } catch (error: any) {
      setResult({
        success: false,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  const testApiHealth = async () => {
    setLoading(true);
    try {
      // Test if the API is reachable
      const apiUrl = import.meta.env.VITE_API_URL;
      console.log('🌐 Testing API Health at:', apiUrl);

      const response = await axios.get(
        `${apiUrl}health`,
        {
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );
      
      setResult({
        success: true,
        status: response.status,
        data: response.data,
        type: 'health'
      });
    } catch (error: any) {
      setResult({
        success: false,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message,
        type: 'health'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper p="md" style={{ margin: '20px' }}>
      <Stack gap="md">
        <Text size="lg" fw={600}>API Debug Tool</Text>

        <Paper p="xs" style={{ backgroundColor: '#e3f2fd' }}>
          <Text size="sm" fw={500}>Environment Info:</Text>
          <Code block>
            VITE_API_URL: {import.meta.env.VITE_API_URL || 'undefined'}
          </Code>
        </Paper>

        <Stack gap="xs">
          <Button onClick={testApiHealth} loading={loading}>
            Test API Health
          </Button>
          <Button onClick={testApiEndpoint} loading={loading}>
            Test Login Endpoint
          </Button>
        </Stack>

        {result && (
          <Paper p="md" style={{ backgroundColor: '#f8f9fa' }}>
            <Text size="sm" fw={600} mb="xs">
              API Response:
            </Text>
            <Code block>
              {JSON.stringify(result, null, 2)}
            </Code>
          </Paper>
        )}
      </Stack>
    </Paper>
  );
};

export default ApiTest;
