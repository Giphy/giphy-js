const inTestsRunner = () => {
    return process.env.NODE_ENV === 'PERCY' || !!(window as any).Cypress
}
export default inTestsRunner
