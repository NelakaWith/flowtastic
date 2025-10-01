import { useEffect, useRef } from "react";
import * as Blockly from "blockly";
import { blocklyOptions } from "../blocks/blocklyConfig";
import "../blocks/customBlocks";

interface BlocklyEditorProps {
  onWorkspaceChange: (workspace: Blockly.WorkspaceSvg) => void;
  workspaceRef: React.MutableRefObject<Blockly.WorkspaceSvg | null>;
}

export const BlocklyEditor: React.FC<BlocklyEditorProps> = ({
  onWorkspaceChange,
  workspaceRef,
}) => {
  const blocklyDiv = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (blocklyDiv.current && !workspaceRef.current) {
      workspaceRef.current = Blockly.inject(blocklyDiv.current, blocklyOptions);

      // Listen to workspace changes
      workspaceRef.current.addChangeListener(() => {
        if (workspaceRef.current) {
          onWorkspaceChange(workspaceRef.current);
        }
      });
    }

    return () => {
      if (workspaceRef.current) {
        workspaceRef.current.dispose();
        workspaceRef.current = null;
      }
    };
  }, [onWorkspaceChange, workspaceRef]);

  return (
    <div className="h-full w-full">
      <div ref={blocklyDiv} className="h-full w-full" />
    </div>
  );
};
