module.exports = {
  plugins: {
    "postcss-preset-env": {
      stage: 0,
      features: {
        "nesting-rules": true,
      },
    },
    "postcss-pxtorem": {
      rootValue: 16, // 换算的基数
      selectorBlackList: [], // 忽略转换正则匹配项
      propList: ['*'],
      replace: true,
  }
  },
};
