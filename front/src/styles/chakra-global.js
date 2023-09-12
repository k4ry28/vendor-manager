import { extendTheme } from "@chakra-ui/react";


const config = {
  initialColorMode: "dark",
  useSystemColorMode: false
}

const theme = extendTheme({
  config,
  styles: {
    global: (props) => ({
      body: {
        backgroundColor: '#000119',
      },
    }),
  },  
});

export default theme;