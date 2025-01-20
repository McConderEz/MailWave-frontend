import { Props } from "../app/router";

export const ContentBlock = (props: Props) => {
  return (
    <div className="w-full bg-neutral-700 rounded-xl flex-1">
      {props.children}
    </div>
  );
};
