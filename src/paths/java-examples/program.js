const indent = (source, count) => source.trim().split('\n')
  .map(line => line ? ' '.repeat(count) + line : '').join('\n');

export function program(main, output, steps, { imports = [], members, commands, details, throws = false } = {}) {
  const lines = [
    imports.map(name => `import ${name};`).join('\n'),
    [
      'public class Main {',
      `    public static void main(String[] args)${throws ? ' throws Exception' : ''} {`,
      indent(main, 8),
      '    }',
      members ? '\n' + indent(members, 4) : undefined,
      '}',
    ].filter(line => line !== undefined).join('\n'),
  ].filter(Boolean);

  return {
    example: lines.join('\n\n'),
    walkthrough: {
      file: 'Main.java',
      commands: commands ?? 'javac Main.java\njava Main',
      output,
      details,
      steps,
    },
  };
}
