export default {
  name: 'Kanban Recruitment QA',
  output: './allure-report',
  historyPath: './allure-history/history.jsonl',
  variables: {
    Application: 'Demo Kanban Board',
    Environment: 'Recruitment demo',
  },
  plugins: {
    awesome: {
      options: {},
    },
  },
};
