# Deleometer Testing Framework

This document describes the testing framework for the Deleometer plugin.

## Overview

The Deleometer testing framework consists of two main components:

1. **Unit Tests** - Tests for individual components
2. **Integration Tests** - Tests for components working together

## Test Structure

### Unit Tests

Unit tests are defined in `tests/unitTests.ts` and test individual components:

- ApiService
- TemplateSystem
- DailyNotesIntegration
- AdvancedAI
- WebApiService
- MobileAdapter
- ResearchModule
- BusinessModel

### Integration Tests

Integration tests are defined in `tests/testFramework.ts` and test components working together:

- API Connection
- Daily Notes Integration
- Template System
- Dashboard View

### Test Runner

The test runner is defined in `tests/testRunner.ts` and provides a UI for running tests and viewing results.

## Running Tests

Tests can be run from the plugin settings page by clicking the "Run Tests" button in the Testing section.

Alternatively, you can run tests programmatically:

```typescript
// Run all tests
const testRunner = new TestRunner(plugin);
await testRunner.runAllTests();

// Run only integration tests
await testRunner.runIntegrationTests();

// Run only unit tests
await testRunner.runUnitTests();
```

## Test Reports

Test reports can be generated and saved to a file:

```typescript
const testRunner = new TestRunner(plugin);
await testRunner.saveTestReport();
```

This will create a markdown file with the test results.

## Components Added

The following components were added to support the testing framework:

1. **WebApiService** - Provides a REST API for third-party applications
2. **MobileAdapter** - Provides synchronization with mobile apps
3. **ResearchModule** - Provides tools for research and validation studies
4. **BusinessModel** - Manages licensing and usage limits
5. **TestRunner** - Provides a UI for running tests and viewing results
6. **TestFramework** - Provides integration tests
7. **UnitTests** - Provides unit tests

## Settings Added

The following settings were added to support the new components:

1. **Web API Settings**
   - Enable Web API
   - Web API Port
   - Web API Key

2. **Mobile Adapter Settings**
   - Enable Mobile Adapter
   - Sync Interval

3. **Research Module Settings**
   - Enable Data Collection
   - Export Batch Size

4. **Business Model Settings**
   - License Key

## UI Added

The following UI elements were added:

1. **Test Results Modal** - Displays test results in a modal
2. **Test Settings** - Allows running tests from the settings page

## CSS Added

CSS styles were added for the test results modal and other UI elements.

## Next Steps

1. Implement the actual components (WebApiService, MobileAdapter, ResearchModule, BusinessModel)
2. Write more comprehensive tests
3. Add more UI elements for managing the new components
4. Add documentation for the new components
