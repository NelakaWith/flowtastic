# Changelog

All notable changes to the Flowtastic project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-10-01

### Added - MVP Release 🎉

#### Core Features

- Visual workflow builder using Google Blockly
- Custom workflow block types:
  - Trigger block (Manual, Webhook, Schedule, Event)
  - Action block (API Call, Function, Email, Database)
  - Condition block (If/Then/Else branching)
  - End block (Success, Failure, Cancelled status)
  - Parameter block (Key-value pairs)
  - Simple Condition block (Comparison operators)
- Real-time YAML and JSON code generation
- Split-view interface (Editor | Preview)
- Workflow persistence using localStorage
- Export workflows as YAML or JSON files
- Copy to clipboard functionality

#### User Interface

- Responsive split-panel layout
- Dark theme for code preview
- Gradient header with branding
- Toolbar controls:
  - Save/Load/Clear operations
  - Undo/Redo functionality
  - Zoom controls (In, Out, Reset)
- Professional styling with TailwindCSS
- Custom scrollbars for code preview

#### Development Tools

- TypeScript for type safety
- ESLint for code quality
- Commitizen for conventional commits
- Commitlint for commit message validation
- Husky for git hooks
- Vite for fast development and building

#### Documentation

- Comprehensive README with:
  - Feature overview
  - Installation instructions
  - Usage guide
  - Block type documentation
  - Development guidelines
  - Contributing guidelines
- Quick Start Guide
- Example workflows document
- Implementation summary
- Original design documentation

#### Architecture

- Modular component structure
- Type-safe workflow definitions
- Recursive block processing
- Extensible block system
- Clean separation of concerns:
  - `/blocks` - Block definitions and configuration
  - `/components` - React components
  - `/utils` - Utility functions and converters

#### Technical Details

- React 19 with functional components and hooks
- Vite 7 for build tooling
- TailwindCSS for styling
- Blockly for visual programming
- js-yaml for YAML generation
- Auto-save on unmount
- Workspace state serialization

### Project Setup

- Initialized React + Vite + TypeScript project
- Configured TailwindCSS with PostCSS
- Set up development environment
- Configured commit conventions
- Added git hooks for code quality

### Documentation

- Created comprehensive project documentation
- Added example workflows
- Included quick start guide
- Documented all block types
- Provided development guidelines

## [Unreleased]

### Planned for v1.1.0

- YAML/JSON import functionality (blocks ← YAML)
- Workflow validation and error highlighting
- Workflow templates library
- Keyboard shortcuts documentation
- Dark/Light theme toggle

### Planned for v2.0.0

- React Flow integration for advanced visualization
- Custom block builder UI
- Multi-workspace support
- Workflow versioning
- Collaborative features

### Planned for v3.0.0

- Backend API integration
- Database persistence
- User authentication
- Team workspaces
- Workflow execution engine
- Real-time execution logs
- Variable substitution
- Error recovery mechanisms

## Contributing

When adding changes, please:

1. Use conventional commit messages
2. Update this changelog
3. Follow semver versioning
4. Document breaking changes

## Commit Types

- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation changes
- **style**: Code style changes (formatting, etc.)
- **refactor**: Code refactoring
- **test**: Adding or updating tests
- **chore**: Maintenance tasks

---

For more details, see the [full documentation](../README.md).
