const inTestsRunner = () => process.env.NODE_ENV === 'PERCY' || process.env.NODE_ENV === 'cypress'
export default inTestsRunner
