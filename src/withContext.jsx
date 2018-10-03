import React from "react";
import i18n from "i18next"; 
import createContext from 'create-react-context';

export const ThemeContext = createContext({  
  translate: namespace => i18n.getFixedT(null, [namespace, "common"])
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