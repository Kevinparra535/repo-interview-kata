const Shadows = {
  bankCard: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },

  bankButton: {
    // Pencil DS: color #2D7EF855 (opacity≈0.33), blur:16, y:4
    shadowColor: '#0D9488',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 4,
  },

  inputFocus: {
    // Pencil DS: color #2D7EF830 (opacity≈0.19), blur:12
    shadowColor: '#0D9488',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.14,
    shadowRadius: 12,
    elevation: 4,
  },

  inputError: {
    // Pencil DS: color #FF525225 (opacity≈0.15), blur:12
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 4,
  },

  cardShadow: {
    // Reference (design): color #0000000F, y:2, blur:8
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },

  cardShadowStrong: {
    // Reference (design): color #0000001A, y:4, blur:12
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },

  destructiveButton: {
    // Pencil DS: color #E5393555 (opacity≈0.33), blur:16, y:4
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 5,
  },

  formCard: {
    // Pencil DS: color #00000030 (opacity≈0.19), y:4, blur:24
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 4,
  },

  logoGlow: {
    // Pencil DS Product Detail hero: color #2D7EF855 blur:32
    shadowColor: '#0D9488',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 24,
    elevation: 8,
  },
};

export default Shadows;
