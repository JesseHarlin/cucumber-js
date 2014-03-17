Feature: HTML Formatter
 In order to simplify processing of Cucumber features and results
 Developers should be able to consume features as HTML

  Scenario: output HTML for a feature with no scenarios
    Given a file named "features/a.feature" with:
      """
      Feature: some feature
      """
    When I run `cucumber.js -f html`
    Then it outputs html
     



