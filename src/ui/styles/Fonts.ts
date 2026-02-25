import { Platform } from 'react-native';

import Colors from './Colors';
import { ms } from './FontsScale';

const Fonts = {
  header1: {
    fontSize: ms(30),
    fontFamily: 'Inter-Bold',
    color: Colors.semantic.text.primaryDark,
    ...Platform.select({
      android: {
        includeFontPadding: false,
      },
    }),
  },

  header2: {
    fontSize: ms(26),
    fontFamily: 'Inter-Bold',
    color: Colors.semantic.text.primaryDark,
    ...Platform.select({
      android: {
        includeFontPadding: false,
      },
    }),
  },

  header3: {
    fontSize: ms(22),
    fontFamily: 'Inter-SemiBold',
    color: Colors.semantic.text.primaryDark,
    ...Platform.select({
      android: {
        includeFontPadding: false,
      },
    }),
  },

  header4: {
    fontSize: ms(22),
    fontFamily: 'Inter-Medium',
    color: Colors.semantic.text.primaryDark,
    ...Platform.select({
      android: {
        includeFontPadding: false,
      },
    }),
  },

  header5: {
    fontSize: ms(18),
    fontFamily: 'Inter-Medium',
    color: Colors.semantic.text.primaryDark,
    ...Platform.select({
      android: {
        includeFontPadding: false,
      },
    }),
  },

  bigHeader: {
    fontSize: ms(25, 0.2),
    fontFamily: 'Inter-Bold',
    color: Colors.semantic.text.primaryDark,
    ...Platform.select({
      android: {
        includeFontPadding: false,
      },
    }),
  },

  bodyText: {
    fontSize: ms(15),
    fontFamily: 'Inter-Regular',
    color: Colors.semantic.text.primaryDark,
    ...Platform.select({
      android: {
        includeFontPadding: false,
      },
    }),
  },

  bodyTextBold: {
    fontSize: ms(15),
    fontFamily: 'Inter-SemiBold',
    color: Colors.semantic.text.primaryDark,
    ...Platform.select({
      android: {
        includeFontPadding: false,
      },
    }),
  },

  smallBodyText: {
    fontSize: ms(13),
    fontFamily: 'Inter-Regular',
    color: Colors.semantic.text.primaryDark,
    ...Platform.select({
      android: {
        includeFontPadding: false,
      },
    }),
  },

  inputsBold: {
    fontSize: ms(17),
    fontFamily: 'Inter-SemiBold',
    color: Colors.semantic.text.primaryDark,
    ...Platform.select({
      android: {
        includeFontPadding: false,
      },
    }),
  },

  inputsNormal: {
    fontSize: ms(15),
    fontFamily: 'Inter-Regular',
    color: Colors.semantic.text.primaryDark,
    ...Platform.select({
      android: {
        includeFontPadding: false,
      },
    }),
  },

  callToActions: {
    fontSize: ms(18),
    fontFamily: 'Inter-SemiBold',
    color: Colors.semantic.text.primaryDark,
    ...Platform.select({
      android: {
        includeFontPadding: false,
      },
    }),
  },

  links: {
    fontSize: ms(12),
    fontFamily: 'Inter-Medium',
    color: Colors.brand.primary,
    ...Platform.select({
      android: {
        includeFontPadding: false,
      },
    }),
  },

  bigNumbers: {
    fontSize: ms(50, 0.2),
    fontFamily: 'Inter-Bold',
    color: Colors.semantic.text.primaryDark,
    ...Platform.select({
      android: {
        includeFontPadding: false,
      },
    }),
  },

  bigNumbersLight: {
    fontSize: ms(50, 0.2),
    fontFamily: 'Inter-Regular',
    color: Colors.semantic.text.primaryDark,
    ...Platform.select({
      android: {
        includeFontPadding: false,
      },
    }),
  },

  labelInputError: {
    fontSize: ms(12, 0.2),
    fontFamily: 'Inter-Regular',
    color: Colors.alerts.error,
    ...Platform.select({
      android: {
        includeFontPadding: false,
      },
    }),
  },
};

export default Fonts;
