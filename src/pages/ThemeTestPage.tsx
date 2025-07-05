import React, { useState } from 'react';
import {
  Container,
  Card,
  Title,
  Text,
  Button,
  TextInput,
  PasswordInput,
  Select,
  Textarea,
  Group,
  Stack,
  Modal,
  Paper,
  Badge,
  Table,
  ActionIcon,
  Menu,
  Popover,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconCheck, IconX, IconSettings, IconBell } from '@tabler/icons-react';
import { useTheme } from '../contexts/ThemeContext';
import PageHeader from '../components/GlobalComponents/PageHeader';

const ThemeTestPage: React.FC = () => {
  const { theme, themeName, toggleTheme } = useTheme();
  const [modalOpened, setModalOpened] = useState(false);
  const [popoverOpened, setPopoverOpened] = useState(false);

  const showSuccessNotification = () => {
    notifications.show({
      title: 'Success!',
      message: 'This is a success notification in the top right corner.',
      color: 'green',
      icon: <IconCheck size={16} />,
      autoClose: 4000,
    });
  };

  const showErrorNotification = () => {
    notifications.show({
      title: 'Error!',
      message: 'This is an error notification in the top right corner.',
      color: 'red',
      icon: <IconX size={16} />,
      autoClose: 4000,
    });
  };

  const tableData = [
    { id: 1, name: 'John Doe', email: 'john@example.com', status: 'Active' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', status: 'Inactive' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', status: 'Active' },
  ];

  return (
    <Container py="md">
      <PageHeader
        title="Theme Test Page"
        subtitle="Test all components in both dark and light themes"
        breadcrumbs={[
          { label: 'Theme Test', href: '/theme-test' },
        ]}
      />

      <Stack gap="lg">
        {/* Theme Controls */}
        <Card shadow="sm" padding="lg">
          <Group justify="space-between" mb="md">
            <Title order={3}>Theme Controls</Title>
            <Badge color={themeName === 'dark' ? 'blue' : 'orange'}>
              {themeName === 'dark' ? 'Dark Mode' : 'Light Mode'}
            </Badge>
          </Group>
          <Group gap="md">
            <Button onClick={toggleTheme}>
              Switch to {themeName === 'dark' ? 'Light' : 'Dark'} Mode
            </Button>
            <Button onClick={showSuccessNotification} color="green">
              Show Success Toast
            </Button>
            <Button onClick={showErrorNotification} color="red">
              Show Error Toast
            </Button>
          </Group>
        </Card>

        {/* Form Components */}
        <Card shadow="sm" padding="lg">
          <Title order={3} mb="md">Form Components</Title>
          <Stack gap="md">
            <TextInput
              label="Text Input"
              placeholder="Enter some text..."
              description="This is a text input field"
            />
            <PasswordInput
              label="Password Input"
              placeholder="Enter password..."
              description="This is a password input field"
            />
            <Select
              label="Select Dropdown"
              placeholder="Choose an option..."
              data={[
                { value: 'option1', label: 'Option 1' },
                { value: 'option2', label: 'Option 2' },
                { value: 'option3', label: 'Option 3' },
              ]}
              description="This is a select dropdown"
            />
            <Textarea
              label="Textarea"
              placeholder="Enter multiple lines of text..."
              description="This is a textarea field"
              rows={3}
            />
          </Stack>
        </Card>

        {/* Interactive Components */}
        <Card shadow="sm" padding="lg">
          <Title order={3} mb="md">Interactive Components</Title>
          <Group gap="md">
            <Button onClick={() => setModalOpened(true)}>
              Open Modal
            </Button>
            
            <Menu shadow="md" width={200}>
              <Menu.Target>
                <Button variant="outline">Menu Dropdown</Button>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Item leftSection={<IconSettings size={14} />}>
                  Settings
                </Menu.Item>
                <Menu.Item leftSection={<IconBell size={14} />}>
                  Notifications
                </Menu.Item>
                <Menu.Divider />
                <Menu.Item color="red">
                  Delete
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>

            <Popover opened={popoverOpened} onChange={setPopoverOpened}>
              <Popover.Target>
                <Button variant="light" onClick={() => setPopoverOpened(!popoverOpened)}>
                  Toggle Popover
                </Button>
              </Popover.Target>
              <Popover.Dropdown>
                <Text size="sm">This is a popover with theme-aware styling!</Text>
              </Popover.Dropdown>
            </Popover>
          </Group>
        </Card>

        {/* Table Component */}
        <Card shadow="sm" padding="lg">
          <Title order={3} mb="md">Table Component</Title>
          <Table striped highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>ID</Table.Th>
                <Table.Th>Name</Table.Th>
                <Table.Th>Email</Table.Th>
                <Table.Th>Status</Table.Th>
                <Table.Th>Actions</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {tableData.map((row) => (
                <Table.Tr key={row.id}>
                  <Table.Td>{row.id}</Table.Td>
                  <Table.Td>{row.name}</Table.Td>
                  <Table.Td>{row.email}</Table.Td>
                  <Table.Td>
                    <Badge color={row.status === 'Active' ? 'green' : 'red'}>
                      {row.status}
                    </Badge>
                  </Table.Td>
                  <Table.Td>
                    <ActionIcon variant="subtle" size="sm">
                      <IconSettings size={16} />
                    </ActionIcon>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Card>

        {/* Color Showcase */}
        <Card shadow="sm" padding="lg">
          <Title order={3} mb="md">Theme Colors</Title>
          <Stack gap="sm">
            <Paper p="md" style={{ backgroundColor: theme.colors.primary }}>
              <Text c="white">Primary Color</Text>
            </Paper>
            <Paper p="md" style={{ backgroundColor: theme.colors.success }}>
              <Text c="white">Success Color</Text>
            </Paper>
            <Paper p="md" style={{ backgroundColor: theme.colors.warning }}>
              <Text c="white">Warning Color</Text>
            </Paper>
            <Paper p="md" style={{ backgroundColor: theme.colors.error }}>
              <Text c="white">Error Color</Text>
            </Paper>
          </Stack>
        </Card>
      </Stack>

      {/* Test Modal */}
      <Modal
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
        title="Theme Test Modal"
        centered
      >
        <Stack gap="md">
          <Text>This modal should have proper theme-aware styling!</Text>
          <TextInput
            label="Test Input"
            placeholder="Type something..."
          />
          <Group justify="flex-end">
            <Button variant="outline" onClick={() => setModalOpened(false)}>
              Cancel
            </Button>
            <Button onClick={() => setModalOpened(false)}>
              Confirm
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Container>
  );
};

export default ThemeTestPage;
