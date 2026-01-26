#!/bin/bash

# 设置 GitHub 用户信息的脚本
# Usage: ./scripts/setup-github-info.sh <your-github-username>

set -e

# 检查参数
if [ -z "$1" ]; then
  echo "❌ Error: GitHub username is required"
  echo ""
  echo "Usage: ./scripts/setup-github-info.sh <your-github-username>"
  echo ""
  echo "Example:"
  echo "  ./scripts/setup-github-info.sh octocat"
  exit 1
fi

GITHUB_USERNAME="$1"

echo "🔧 Setting up GitHub information..."
echo "   Username: $GITHUB_USERNAME"
echo ""

# 需要替换的文件列表
FILES=(
  "src/App.jsx"
  "src/components/BuildInfo.jsx"
  "README.md"
  "BUILD_INFO.md"
  "public/docs/RUNBOOK.md"
  "public/docs/DEPLOYMENT.md"
  "terraform/variables.tf"
)

# 统计替换次数
TOTAL_REPLACED=0

# 遍历文件并替换
for file in "${FILES[@]}"; do
  if [ -f "$file" ]; then
    # macOS 使用 sed -i ''，Linux 使用 sed -i
    if [[ "$OSTYPE" == "darwin"* ]]; then
      # macOS
      COUNT=$(grep -c "YOUR_USERNAME" "$file" 2>/dev/null || echo "0")
      if [ "$COUNT" -gt 0 ]; then
        sed -i '' "s/YOUR_USERNAME/$GITHUB_USERNAME/g" "$file"
        echo "✅ Updated: $file ($COUNT occurrences)"
        TOTAL_REPLACED=$((TOTAL_REPLACED + COUNT))
      fi
    else
      # Linux
      COUNT=$(grep -c "YOUR_USERNAME" "$file" 2>/dev/null || echo "0")
      if [ "$COUNT" -gt 0 ]; then
        sed -i "s/YOUR_USERNAME/$GITHUB_USERNAME/g" "$file"
        echo "✅ Updated: $file ($COUNT occurrences)"
        TOTAL_REPLACED=$((TOTAL_REPLACED + COUNT))
      fi
    fi
  else
    echo "⚠️  Skipped: $file (not found)"
  fi
done

echo ""
echo "🎉 Done! Replaced $TOTAL_REPLACED occurrences of YOUR_USERNAME with $GITHUB_USERNAME"
echo ""
echo "📝 Next steps:"
echo "   1. Review changes: git diff"
echo "   2. Test locally: npm run dev"
echo "   3. Commit changes: git add . && git commit -m 'chore: set GitHub username'"
echo ""
