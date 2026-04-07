#!/bin/bash
# Generate commit message for current changes

echo "Suggested commit message:"
echo ""
echo "feat: add infrastructure package with HTTP and auth providers"
echo ""
echo "This commit adds:"
echo "- HTTP providers (Fetch and Axios) in @repo/infrastructure"
echo "- Authentication providers (MSAL, Backend, Mixed) in @repo/infrastructure"
echo "- Enhanced API client with provider switching capability"
echo "- Commit message conventions and automated validation"
echo "- Husky git hooks for commit message linting"
echo ""
echo "BREAKING CHANGE: API client factory now supports provider switching"