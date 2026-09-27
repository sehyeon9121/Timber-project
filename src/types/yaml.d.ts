// YAML 파일 import를 위한 타입 선언
declare module '*.yaml' {
  const content: unknown;
  export default content;
}

declare module '*.yml' {
  const content: unknown;
  export default content;
}
