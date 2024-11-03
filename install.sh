# File: setup.sh (for Unix-like systems)
#!/bin/bash

# Function to set up git hooks
setup_git_hooks() {
    echo "🔧 Setting up git hooks..."
    
    # Create hooks directory
    mkdir -p .git/hooks

    # Create post-merge hook with platform detection
    cat > .git/hooks/post-merge << 'EOF'
#!/bin/bash

# Platform detection
platform='unknown'
if [[ "$OSTYPE" == "darwin"* ]]; then
    platform='macos'
elif [[ "$OSTYPE" == "msys" || "$OSTYPE" == "cygwin" ]]; then
    platform='windows'
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    platform='linux'
fi

echo "🔄 Configuring git for $platform..."

# Set core.autocrlf based on platform
if [[ $platform == 'windows' ]]; then
    git config core.autocrlf true
elif [[ $platform == 'macos' || $platform == 'linux' ]]; then
    git config core.autocrlf input
fi

# Set merge driver
git config merge.ours.driver true

# Verify .gitattributes
if [ ! -f .gitattributes ]; then
    echo "# Git attributes for cross-platform compatibility" > .gitattributes
    echo "* text=auto" >> .gitattributes
    echo "README.md merge=ours" >> .gitattributes
    echo "*.sh text eol=lf" >> .gitattributes
    echo "*.bat text eol=crlf" >> .gitattributes
    echo "✅ Created .gitattributes file"
fi

echo "✅ Repository configured for $platform"
EOF

    # Make hook executable for Unix systems
    chmod +x .git/hooks/post-merge

    echo "✅ Git hooks setup completed"
}

# Run setup
setup_git_hooks