"""Setup configuration for AlphaNest."""

from setuptools import setup, find_packages

with open("README.md", "r", encoding="utf-8") as fh:
    long_description = fh.read()

setup(
    name="alphanest",
    version="0.1.0",
    author="AlphaNest Team",
    description="An AI-driven trading bot for financial autonomy",
    long_description=long_description,
    long_description_content_type="text/markdown",
    url="https://github.com/cywf/AlphaNest",
    package_dir={"": "src"},
    packages=find_packages(where="src"),
    classifiers=[
        "Development Status :: 3 - Alpha",
        "Intended Audience :: Developers",
        "Topic :: Office/Business :: Financial :: Investment",
        "Programming Language :: Python :: 3",
        "Programming Language :: Python :: 3.8",
        "Programming Language :: Python :: 3.9",
        "Programming Language :: Python :: 3.10",
        "Programming Language :: Python :: 3.11",
    ],
    python_requires=">=3.8",
    install_requires=[
        "python-dateutil>=2.8.2",
        "pytz>=2023.3",
        "pandas>=2.0.0",
        "numpy>=1.24.0",
        "python-dotenv>=1.0.0",
    ],
    extras_require={
        "dev": [
            "pytest>=7.4.0",
            "pytest-cov>=4.1.0",
            "pytest-mock>=3.11.1",
            "pylint>=2.17.0",
            "black>=23.7.0",
            "flake8>=6.1.0",
            "mypy>=1.4.0",
        ],
    },
    entry_points={
        "console_scripts": [
            "alphanest=alphanest.core.bot:main",
        ],
    },
)
