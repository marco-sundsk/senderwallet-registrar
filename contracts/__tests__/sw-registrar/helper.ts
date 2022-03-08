import { Workspace, NEAR, NearAccount, BN } from "near-workspaces-ava";

export function initWorkSpace() {
  return Workspace.init(async ({ root }) => {
    const owner = await root.createAccount('linear_owner');
    const alice = await root.createAccount('alice');
    const bob = await root.createAccount('bob');

    const contract = await deployContract(root, owner.accountId);

    return { contract, owner, alice, bob };
  });
}

export async function deployContract(
  root: NearAccount,
  owner_id: string,
  contractId = 'sw-registrar',
) {
  return root.createAndDeploy(
    contractId,
    'res/sw_registrar_local.wasm',
    {
      method: 'new',
      args: {
        owner_id,
      }
    }
  )
}

export async function assertFailure(
  test: any,
  action: Promise<unknown>,
  errorMessage?: string
) {
  let failed = false;

  try {
    await action;
  } catch (e) {
    if (errorMessage) {
      let msg: string = e.kind.ExecutionError;
      test.truthy(
        msg.includes(errorMessage),
        `Bad error message. expect: "${errorMessage}", actual: "${msg}"`
      );
    }
    failed = true;
  }

  test.is(
    failed,
    true,
    "Action didn't fail"
  );
}

export async function callWithMetrics(
    account: NearAccount,
    contractId: NearAccount | string,
    methodName: string,
    args: Record<string, unknown>,
    options?: {
      gas?: string | BN;
      attachedDeposit?: string | BN;
    }
  ) {
    const txResult = await account.call_raw(contractId, methodName, args, options);
    const successValue = txResult.parseResult();
    const outcome = txResult.result.transaction_outcome.outcome;
    const tokensBurnt = NEAR.from(outcome.gas_burnt + '000000000');
    return {
      successValue,
      metrics: {
        tokensBurnt
      }
    }
}

// This is needed due to some unknown issues of balance accuracy in sandbox
export async function numbersEqual(test: any, a: NEAR, b: NEAR, diff = 0.000001) {
  test.is(
    a.sub(b).abs().lt(NEAR.parse(diff.toString())),
    true
  )
}

// Match considering precision loss
export async function noMoreThanOneYoctoDiff(test: any, a: NEAR, b: NEAR) {
  test.is(
    a.sub(b).abs().lte(NEAR.from("1")),
    true
  )
}

export function skip(...args: any[]) {
  console.debug(`Skipping test ${args[0]} ...`);
};

export async function registerFungibleTokenUser(ft: NearAccount, user: NearAccount) {
  const storage_balance = await ft.view(
    'storage_balance_bounds',
    {}
  ) as any;
  await user.call(
    ft,
    'storage_deposit',
    { account_id: user },
    { attachedDeposit: storage_balance.min.toString() },
  );
}

export function parseNEAR(a: number): NEAR {
  const yoctoString = a.toLocaleString('fullwide', { useGrouping: false });
  return NEAR.from(yoctoString);
}


