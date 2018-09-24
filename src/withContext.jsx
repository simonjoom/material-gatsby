import React from "react";

export const ThemeContext = React.createContext({  
  translate: false
});

// This function takes a component...
function withTheme(Component) {
  // ...and returns another component...
  return function ThemedComponent(props) {
    // ... and renders the wrapped component with the context theme!
    // Notice that we pass through any additional props as well
    return (
      <ThemeContext.Consumer>
        {context => (
          <Component
            {...props} 
            translate={context.translate}
          />
        )}
      </ThemeContext.Consumer>
    );
  };
}
export default withTheme