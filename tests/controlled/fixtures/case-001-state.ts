export type Case001State = 'ready' | 'blocked';

const renderedState: Case001State = 'ready';

export function renderCase001State(): string {
  return `
    <main aria-label="Case 001">
      <div data-testid="case-state" data-state="${renderedState}">
        Checkout state
      </div>
    </main>
  `;
}
