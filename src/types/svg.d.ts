declare module "*.svg?react" {
  import * as React from "react";
  const ReactComponent: React.FunctionComponent<
    React.SVGProps<SVGSVGElement> & {
      title?: string;
      ref?: React.Ref<SVGSVGElement>;
    }
  >;
  export default ReactComponent;
}
