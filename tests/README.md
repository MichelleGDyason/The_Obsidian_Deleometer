# Deleometer Tests

This directory contains tests for the Deleometer plugin.

## Test Structure

The test system consists of two main components:

1. **TestFramework** - Integration tests that test the plugin's components working together
2. **UnitTests** - Unit tests for individual components

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

## Adding New Tests

### Adding Integration Tests

To add a new integration test, modify the `TestFramework` class in `testFramework.ts`:

1. Add a new test method
2. Call the test method from `runAllTests()`
3. Use the `runTest()` method to run the test and record the result

Example:

```typescript
private async testNewFeature(): Promise<void> {
    console.log('[TestFramework] Testing new feature...');
    
    try {
        await this.runTest('New Feature Test', async () => {
            // Test code here
            return true; // Return true if the test passes
        });
        
        console.log('[TestFramework] New feature tests completed');
    } catch (error) {
        console.error('[TestFramework] Error testing new feature:', error);
        this.testResults.push({
            name: 'New Feature Error',
            passed: false,
            error: error.message || 'Unknown error'
        });
    }
}
```

### Adding Unit Tests

To add a new unit test, modify the `UnitTests` class in `unitTests.ts`:

1. Add a new test method
2. Call the test method from `runAllTests()`
3. Use the `runTest()` method to run the test and record the result

Example:

```typescript
private async testNewComponent(): Promise<void> {
    console.log('[UnitTests] Testing new component...');
    
    try {
        // Create component
        const component = new NewComponent();
        
        // Test constructor
        await this.runTest('NewComponent Constructor', () => {
            return component !== null;
        });
        
        // Test methods
        await this.runTest('NewComponent.method', async () => {
            const result = await component.method();
            return result === expectedResult;
        });
        
        console.log('[UnitTests] New component tests completed');
    } catch (error) {
        console.error('[UnitTests] Error testing new component:', error);
        this.testResults.push({
            component: 'NewComponent',
            name: 'Error',
            passed: false,
            error: error.message || 'Unknown error'
        });
    }
}
```
