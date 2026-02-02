#!/usr/bin/env python3
"""
博客构建验证工具

用法:
    python build_check.py
    python build_check.py --skip-build  # 跳过构建，仅检查现有构建结果
"""

import subprocess
import sys
import argparse
from pathlib import Path
import time


class BuildValidator:
    """构建验证器"""
    
    def __init__(self, skip_build: bool = False):
        self.skip_build = skip_build
        self.project_root = Path.cwd()
        self.errors = []
        self.warnings = []
        
    def validate(self) -> bool:
        """执行构建验证"""
        print("🔨 博客构建验证工具\n")
        print(f"项目目录: {self.project_root}\n")
        
        # 检查是否在正确的目录
        if not self._check_project_structure():
            return False
        
        # 执行构建
        if not self.skip_build:
            if not self._run_build():
                return False
        else:
            print("⏭️  跳过构建步骤\n")
        
        # 检查构建输出
        if not self._check_build_output():
            return False
        
        return len(self.errors) == 0
    
    def _check_project_structure(self) -> bool:
        """检查项目结构"""
        print("📁 检查项目结构...")
        
        required_dirs = ['src/content/posts']
        required_files = ['package.json']
        config_files = ['astro.config.mjs', 'astro.config.ts']
        
        # 检查必需目录
        for dir_path in required_dirs:
            path = self.project_root / dir_path
            if not path.exists():
                self.errors.append(f"缺少必需目录: {dir_path}")
                print(f"  ❌ {dir_path}")
            else:
                print(f"  ✅ {dir_path}")
                
        # 检查必需文件
        for file_path in required_files:
            path = self.project_root / file_path
            if not path.exists():
                self.errors.append(f"缺少必需文件: {file_path}")
                print(f"  ❌ {file_path}")
            else:
                print(f"  ✅ {file_path}")
                
        # 检查配置文件 (两者居一即可)
        config_found = False
        for config_file in config_files:
            if (self.project_root / config_file).exists():
                print(f"  ✅ {config_file}")
                config_found = True
                break
        
        if not config_found:
            self.errors.append("缺少 Astro 配置文件 (astro.config.mjs 或 astro.config.ts)")
            print("  ❌ astro.config.mjs/ts")
        
        print()
        return len(self.errors) == 0
    
    def _run_build(self) -> bool:
        """运行构建命令"""
        print("🔨 执行构建...")
        print("  命令: pnpm run build\n")
        
        start_time = time.time()
        
        try:
            # 运行构建命令
            result = subprocess.run(
                ['pnpm', 'run', 'build'],
                cwd=self.project_root,
                capture_output=True,
                text=True,
                timeout=300  # 5分钟超时
            )
            
            elapsed = time.time() - start_time
            
            # 打印构建输出
            if result.stdout:
                print("📄 构建输出:")
                # 只打印最后几行关键信息
                lines = result.stdout.strip().split('\n')
                for line in lines[-20:]:  # 最后20行
                    print(f"  {line}")
                print()
            
            if result.returncode != 0:
                self.errors.append("构建失败")
                print(f"❌ 构建失败 (退出码: {result.returncode})")
                
                if result.stderr:
                    print("\n错误信息:")
                    print(result.stderr)
                
                return False
            
            print(f"✅ 构建成功 (耗时: {elapsed:.1f}秒)\n")
            return True
            
        except subprocess.TimeoutExpired:
            self.errors.append("构建超时 (超过5分钟)")
            print("❌ 构建超时\n")
            return False
            
        except FileNotFoundError:
            self.errors.append("未找到 pnpm 命令，请确保已安装 pnpm")
            print("❌ 未找到 pnpm 命令\n")
            print("提示: 运行 'npm install -g pnpm' 安装 pnpm\n")
            return False
            
        except Exception as e:
            self.errors.append(f"构建过程出错: {e}")
            print(f"❌ 构建出错: {e}\n")
            return False
    
    def _check_build_output(self) -> bool:
        """检查构建输出"""
        print("📦 检查构建输出...")
        
        dist_dir = self.project_root / 'dist'
        
        if not dist_dir.exists():
            self.errors.append("构建输出目录 dist/ 不存在")
            print("  ❌ dist/ 目录不存在\n")
            return False
        
        # 检查关键文件
        expected_files = [
            'index.html',
        ]
        
        for file_name in expected_files:
            file_path = dist_dir / file_name
            if file_path.exists():
                size = file_path.stat().st_size
                print(f"  ✅ {file_name} ({size:,} bytes)")
            else:
                self.warnings.append(f"构建输出缺少文件: {file_name}")
                print(f"  ⚠️  {file_name} (不存在)")
        
        # 统计构建文件数量
        total_files = sum(1 for _ in dist_dir.rglob('*') if _.is_file())
        total_size = sum(f.stat().st_size for f in dist_dir.rglob('*') if f.is_file())
        
        print(f"\n  📊 构建统计:")
        print(f"     文件总数: {total_files}")
        print(f"     总大小: {total_size / 1024 / 1024:.2f} MB")
        print()
        
        return True
    
    def print_summary(self):
        """打印总结"""
        print("="*60)
        
        if self.errors:
            print("❌ 验证失败\n")
            print("错误:")
            for error in self.errors:
                print(f"  • {error}")
            print()
        
        if self.warnings:
            print("⚠️  警告:")
            for warning in self.warnings:
                print(f"  • {warning}")
            print()
        
        if not self.errors and not self.warnings:
            print("✅ 所有检查通过！")
        elif not self.errors:
            print("✅ 验证通过（有警告）")
        
        print("="*60)


def main():
    parser = argparse.ArgumentParser(
        description="博客构建验证工具",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
示例:
  # 执行完整构建验证
  python build_check.py
  
  # 跳过构建，仅检查现有构建结果
  python build_check.py --skip-build

验证项目:
  ✓ 项目结构完整性
  ✓ 构建命令执行成功
  ✓ 构建输出文件存在
  ✓ 构建统计信息
        """
    )
    
    parser.add_argument(
        '--skip-build',
        action='store_true',
        help='跳过构建步骤，仅检查现有构建结果'
    )
    
    args = parser.parse_args()
    
    # 执行验证
    validator = BuildValidator(skip_build=args.skip_build)
    is_valid = validator.validate()
    validator.print_summary()
    
    # 返回退出码
    sys.exit(0 if is_valid else 1)


if __name__ == "__main__":
    main()
