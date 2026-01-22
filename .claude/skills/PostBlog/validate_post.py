#!/usr/bin/env python3
"""
博客文章验证工具

用法:
    python validate_post.py <文章路径>
    python validate_post.py src/content/posts/my-article.md
    
    # 验证多个文件
    python validate_post.py src/content/posts/*.md
"""

import sys
import re
import argparse
from pathlib import Path
from typing import Dict, List, Tuple, Any
from datetime import datetime


class PostValidator:
    """博客文章验证器"""
    
    def __init__(self, file_path: str):
        self.file_path = Path(file_path)
        self.content = ""
        self.frontmatter = {}
        self.body = ""
        self.errors = []
        self.warnings = []
        
    def validate(self) -> bool:
        """执行完整验证"""
        if not self.file_path.exists():
            self.errors.append(f"文件不存在: {self.file_path}")
            return False
            
        # 读取文件
        try:
            self.content = self.file_path.read_text(encoding='utf-8')
        except Exception as e:
            self.errors.append(f"读取文件失败: {e}")
            return False
        
        # 解析 frontmatter
        if not self._parse_frontmatter():
            return False
        
        # 执行各项验证
        self._validate_required_fields()
        self._validate_date_format()
        self._validate_tags_format()
        self._validate_abbrlink()
        self._validate_draft_status()
        self._validate_h1_title()
        self._validate_file_location()
        
        return len(self.errors) == 0
    
    def _parse_frontmatter(self) -> bool:
        """解析 YAML frontmatter"""
        # 匹配 frontmatter (--- 开头和结尾)
        pattern = r'^---\s*\n(.*?)\n---\s*\n(.*)$'
        match = re.match(pattern, self.content, re.DOTALL)
        
        if not match:
            self.errors.append("未找到有效的 frontmatter (需要 --- 包围)")
            return False
        
        frontmatter_text = match.group(1)
        self.body = match.group(2)
        
        # 简单解析 YAML (仅支持基本的 key: value 格式)
        for line in frontmatter_text.split('\n'):
            line = line.strip()
            if not line or line.startswith('#'):
                continue
                
            if ':' in line:
                key, value = line.split(':', 1)
                key = key.strip()
                value = value.strip()
                
                # 处理数组格式 [item1, item2]
                if value.startswith('[') and value.endswith(']'):
                    value = [item.strip() for item in value[1:-1].split(',')]
                # 处理布尔值
                elif value.lower() in ('true', 'false'):
                    value = value.lower() == 'true'
                # 处理数字
                elif value.isdigit():
                    value = int(value)
                # 移除引号
                elif value.startswith(("'", '"')) and value.endswith(("'", '"')):
                    value = value[1:-1]
                    
                self.frontmatter[key] = value
        
        return True
    
    def _validate_required_fields(self):
        """验证必需字段"""
        required = ['title', 'published']
        
        for field in required:
            if field not in self.frontmatter:
                self.errors.append(f"缺少必需字段: {field}")
            elif not self.frontmatter[field]:
                self.errors.append(f"必需字段不能为空: {field}")
    
    def _validate_date_format(self):
        """验证日期格式 (YYYY-MM-DD)"""
        date_pattern = r'^\d{4}-\d{2}-\d{2}$'
        
        for field in ['published', 'updated']:
            if field in self.frontmatter:
                date_value = str(self.frontmatter[field])
                if not re.match(date_pattern, date_value):
                    self.errors.append(
                        f"{field} 日期格式错误: '{date_value}' (应为 YYYY-MM-DD)"
                    )
                else:
                    # 验证日期是否有效
                    try:
                        datetime.strptime(date_value, '%Y-%m-%d')
                    except ValueError:
                        self.errors.append(f"{field} 日期无效: {date_value}")
    
    def _validate_tags_format(self):
        """验证 tags 格式 (应为数组)"""
        if 'tags' in self.frontmatter:
            tags = self.frontmatter['tags']
            if not isinstance(tags, list):
                self.errors.append(
                    f"tags 格式错误: 应为数组格式 [tag1, tag2]，当前为: {tags}"
                )
            elif len(tags) == 0:
                self.warnings.append("tags 为空，建议添加 3-5 个标签")
            elif len(tags) > 10:
                self.warnings.append(f"tags 过多 ({len(tags)} 个)，建议保持在 3-5 个")
    
    def _validate_abbrlink(self):
        """验证 abbrlink (只能包含小写字母、数字、连字符)"""
        if 'abbrlink' in self.frontmatter:
            abbrlink = str(self.frontmatter['abbrlink'])
            if not re.match(r'^[a-z0-9-]+$', abbrlink):
                self.errors.append(
                    f"abbrlink 格式错误: '{abbrlink}' "
                    "(只能包含小写字母、数字、连字符)"
                )
    
    def _validate_draft_status(self):
        """验证 draft 状态"""
        if 'draft' in self.frontmatter:
            draft = self.frontmatter['draft']
            if draft is True:
                self.warnings.append("文章处于草稿状态 (draft: true)，不会发布")
    
    def _validate_h1_title(self):
        """验证 H1 标题 (有且只有一个)"""
        # 查找所有 H1 标题 (# 开头，但不是 ## 或更多)
        h1_pattern = r'^# [^#].*$'
        h1_titles = re.findall(h1_pattern, self.body, re.MULTILINE)
        
        if len(h1_titles) == 0:
            self.errors.append("文章缺少 H1 标题 (# 标题)")
        elif len(h1_titles) > 1:
            self.errors.append(
                f"文章包含多个 H1 标题 ({len(h1_titles)} 个)，应该只有一个"
            )
    
    def _validate_file_location(self):
        """验证文件位置"""
        expected_dir = Path("src/content/posts")
        
        # 检查文件是否在正确的目录
        try:
            self.file_path.relative_to(expected_dir)
        except ValueError:
            self.warnings.append(
                f"文件不在推荐目录 {expected_dir}/ 中，当前位置: {self.file_path.parent}"
            )
    
    def print_report(self):
        """打印验证报告"""
        print(f"\n{'='*60}")
        print(f"验证文件: {self.file_path}")
        print(f"{'='*60}\n")
        
        # 打印元数据信息
        if self.frontmatter:
            print("📋 元数据:")
            for key, value in self.frontmatter.items():
                if isinstance(value, list):
                    print(f"  • {key}: [{', '.join(str(v) for v in value)}]")
                else:
                    print(f"  • {key}: {value}")
            print()
        
        # 打印错误
        if self.errors:
            print("❌ 错误:")
            for error in self.errors:
                print(f"  • {error}")
            print()
        
        # 打印警告
        if self.warnings:
            print("⚠️  警告:")
            for warning in self.warnings:
                print(f"  • {warning}")
            print()
        
        # 打印结果
        if not self.errors and not self.warnings:
            print("✅ 验证通过！文章符合所有规范。\n")
            return True
        elif not self.errors:
            print("✅ 验证通过（有警告）\n")
            return True
        else:
            print(f"❌ 验证失败：发现 {len(self.errors)} 个错误\n")
            return False


def validate_file(file_path: str) -> bool:
    """验证单个文件"""
    validator = PostValidator(file_path)
    is_valid = validator.validate()
    validator.print_report()
    return is_valid


def main():
    parser = argparse.ArgumentParser(
        description="博客文章验证工具",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
示例:
  # 验证单个文件
  python validate_post.py src/content/posts/my-article.md
  
  # 验证多个文件
  python validate_post.py src/content/posts/article1.md src/content/posts/article2.md
  
验证项目:
  ✓ 必需字段 (title, published)
  ✓ 日期格式 (YYYY-MM-DD)
  ✓ tags 格式 (数组)
  ✓ abbrlink 格式 (小写字母、数字、连字符)
  ✓ H1 标题 (有且只有一个)
  ✓ 文件位置 (src/content/posts/)
        """
    )
    
    parser.add_argument(
        'files',
        nargs='+',
        help='要验证的 Markdown 文件路径'
    )
    
    parser.add_argument(
        '-v', '--verbose',
        action='store_true',
        help='显示详细信息'
    )
    
    args = parser.parse_args()
    
    # 验证所有文件
    all_valid = True
    total_files = len(args.files)
    
    for i, file_path in enumerate(args.files, 1):
        if total_files > 1:
            print(f"\n[{i}/{total_files}] ", end="")
        
        is_valid = validate_file(file_path)
        all_valid = all_valid and is_valid
    
    # 总结
    if total_files > 1:
        print(f"\n{'='*60}")
        if all_valid:
            print(f"✅ 所有文件验证通过 ({total_files} 个)")
        else:
            print(f"❌ 部分文件验证失败")
        print(f"{'='*60}\n")
    
    # 返回退出码
    sys.exit(0 if all_valid else 1)


if __name__ == "__main__":
    main()
