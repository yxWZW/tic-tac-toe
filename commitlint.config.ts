module.exports = {
    extends: ['@commitlint/config-conventional'],
    rules: { 'type-enum': [2, 'always', ['#FEAT', '#FIX', '#DOCS', '#STYLE', '#REFACTOR', '#CHORE', '#PERF']] },
};
