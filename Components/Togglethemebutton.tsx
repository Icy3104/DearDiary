import React from 'react';
import { Button, View } from 'react-native';
import { useThemeContext } from '../Context/Themecontext';

const Togglethemebutton: React.FC = () => {
  const { theme, toggleTheme } = useThemeContext();

  return (
    <View style={{ marginVertical: 10 }}>
      <Button
        title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
        onPress={toggleTheme}
      />
    </View>
  );
};

export default Togglethemebutton;